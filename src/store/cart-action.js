import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";
export const sendCartData = cart => {
  return async dispatch => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending",
        message: "Sending Cart Data",
      })
    );
    const sendRequest = async () => {
      const response = await fetch(
        "https://react-http-4c46f-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "Success",
          title: "Success",
          message: "Sent Cart Data Successfully",
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: "Error",
          title: "Error",
          message: err.message,
        })
      );
    }
  };
};

export const fetchCartData = () => {
  return async dispatch => {
    const fetchData = async () => {
      const response = await fetch(
        "https://react-http-4c46f-default-rtdb.firebaseio.com/cart.json"
      );
      if (!response.ok) {
        throw new Error("Could not fetch data");
      }
      const responseData = await response.json();
      return responseData;
    };

    try {
      const cartData = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          status: "Error",
          title: "Error",
          message: err.message,
        })
      );
    }
  };
};
