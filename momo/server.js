const axios = require("axios");
const cors = require("cors");
const express = require("express");
const crypto = require("crypto");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

app.post("/payment", async (req, res) => {
  const { amount, orderInfo: orderInfoData } = req.body;

  var orderInfo = "pay with MoMo";
  var partnerCode = "MOMO";
  var redirectUrl = "https://fast-food-ecommerce.vercel.app/success";
  var ipnUrl =
    "https://1589-2402-800-63a8-dd41-550-3021-3cf6-a760.ngrok-free.app/callback";
  var requestType = "payWithMethod";
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = Buffer.from(JSON.stringify(orderInfoData)).toString("base64");
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  console.log(amount);

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    orderData: orderInfoData,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  // axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  let result;
  try {
    result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "server error",
    });
  }
});

app.post("/callback", async (req, res) => {
  const { insertMultipleOrders, insertOrder, insertUser } = await import(
    "../../app/_lib/actions.js"
  );

  console.log(req.body);

  const { extraData } = req.body;

  let orderDataBody;
  if (extraData) {
    try {
      orderDataBody = JSON.parse(
        Buffer.from(extraData, "base64").toString("utf-8")
      );
    } catch (error) {
      console.log("Error decoding extraData:", error);
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid extraData format",
      });
    }
  }

  let updateData = [...orderDataBody.orderData];

  try {
    if (!orderDataBody.id) {
      const guestData = {
        fullName: orderDataBody.name,
        email: orderDataBody.email,
        address: orderDataBody.address,
        phone: orderDataBody.phone,
      };
      const { userData } = await insertUser(guestData);
      updateData = updateData.map((data) => ({
        ...data,
        guestId: userData[0].id,
      }));
      orderDataBody.id = userData[0].id;
    }

    const orderTime = new Date(Date.now() + 7 * 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");
    updateData = updateData.map((data) => ({
      ...data,
      orderTime: orderTime,
    }));
    updateData = updateData.map((data) => ({
      ...data,
      status: "paid",
      isPaid: true,
    }));

    if (updateData.length > 1) {
      await insertMultipleOrders(updateData);
    } else await insertOrder(updateData[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "server error",
    });
  }

  return res.status(200).json(req.body);
});

app.post("/transaction-status", async (req, res) => {
  const { orderId } = req.body;

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  });

  //options for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  let result;
  try {
    result = await axios(options);

    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "server error",
    });
  }
});

app.listen(6000, (error) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log("Server is running at port 6000");
});
