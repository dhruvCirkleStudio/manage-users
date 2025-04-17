export const apiResponse = (
  res,
  statusCode,
  { status = true, message = "", data = null }
) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

export const errorResponse = (
  res, 
  statusCode, 
  {message = "An error occured!"}
) => {
  return res.status(statusCode).json({
    status:false,
    message,
    data: null
  });
};
