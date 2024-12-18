import supabase from "./supabase.js";
import toast from "react-hot-toast";

export const getFoods = async () => {
  let { data: foods, error } = await supabase
    .from("foods")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Lỗi tải dữ liệu món ăn! Vui lòng thử lại sau!");
  }

  return { foods, error };
};

export const getFood = async (id) => {
  let { data: food, error } = await supabase
    .from("foods")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Lỗi tải dữ liệu món ăn! Vui lòng thử lại sau!");
  }

  return { food, error };
};

export const getCategories = async () => {
  let { data: categories, error } = await supabase
    .from("category")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Lỗi tải dữ liệu các loại mặt hàng! Vui lòng thử lại sau!");
  }

  return { categories, error };
};

export const getRelatedFoods = async (category, id) => {
  const { data: relatedFoods, error } = await supabase
    .from("foods")
    .select("*")
    .eq("category", category)
    .neq("id", id)
    .limit(8)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      "Lỗi tải dữ liệu các món ăn tương ứng! Vui lòng thử lại sau!"
    );
  }

  return { relatedFoods, error };
};

export const insertContact = async (newData) => {
  const { data: contactData, error } = await supabase
    .from("contact")
    .insert([newData])
    .select();

  if (error) {
    toast.error(error.message);
    throw new Error(
      "Lỗi upload dữ liệu ý kiến khách hàng! Vui lòng thử lại sau!"
    );
  }

  return { contactData, error };
};

export const getSpecificUser = async (email) => {
  let { data: guest, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (error) {
    toast.error(error.message);
    throw new Error("Lấy dữ liệu khách hàng thất bại! Vui lòng thử lại sau!");
  }

  if (!guest || guest.length == 0) {
    guest = [];
    return { guest };
  }

  return { guest: guest[0], error };
};

export const getSpecificOrders = async (guestId) => {
  let { data: orderData, error } = await supabase
    .from("orders")
    .select("*")
    .eq("guestId", guestId)
    .order("created_at", { ascending: false });

  if (error) {
    toast.error(error.message);
    throw new Error("Lấy dữ liệu mua hàng thất bại! Vui lòng thử lại sau!");
  }

  return { orderData, error };
};

export const getOrdersCount = async (guestId) => {
  let { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("guestId", guestId);

  if (error) {
    toast.error(error.message);
    throw new Error("Lấy số lượng đơn hàng thất bại! Vui lòng thử lại sau!");
  }

  return { count, error };
};

export const getPaginationOrders = async (guestId, start, end) => {
  let { data: paginationOrders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("guestId", guestId)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    toast.error(error.message);
    throw new Error(
      "Lấy dữ liệu phân trang đơn đặt hàng thất bại! Vui lòng thử lại sau!"
    );
  }

  return { paginationOrders, error };
};

export const getSpecificFoods = async (foodId) => {
  let { data: foods, error } = await supabase
    .from("foods")
    .select("*")
    .in("id", foodId);

  if (error) {
    toast.error(error.message);
    throw new Error("Lấy dữ liệu món ăn thất bại! Vui lòng thử lại sau!");
  }

  return { foods, error };
};

export const insertOrder = async (newData) => {
  const { data: orderInsert, error } = await supabase
    .from("orders")
    .insert([newData])
    .select();

  if (error) {
    toast.error(error.message);
    throw new Error("Lỗi tạo đơn hàng! Vui lòng thử lại sau!");
  }

  return { orderInsert, error };
};

export const insertMultipleOrders = async (newData) => {
  const { data: orderMultipleInsert, error } = await supabase
    .from("orders")
    .insert(newData)
    .select();

  if (error) {
    toast.error(error.message);
    throw new Error("Lỗi tạo đơn hàng! Vui lòng thử lại sau!");
  }

  return { orderMultipleInsert, error };
};

export const updateOrder = async (updateData, id) => {
  const { data: updatedData, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) {
    toast.error(error.message);
    throw new Error("Lỗi cập nhật đơn hàng! Vui lòng thử lại sau!");
  }

  return { updatedData, error };
};

export const insertUser = async (newData) => {
  const { data: userData, error } = await supabase
    .from("guests")
    .insert([newData])
    .select();

  if (error) {
    toast.error(error.message);
    throw new Error("Thêm dữ liệu khách hàng thất bại! Vui lòng thử lại sau!");
  }

  return { userData, error };
};
