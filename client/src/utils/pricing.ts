export const getOriginalPrice = (price: number, discount: number) => {
  if (!discount) return price;
  return Math.round(price / (1 - discount / 100));
};

export const getLineTotal = (price: number, quantity: number) => price * quantity;
