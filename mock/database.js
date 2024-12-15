export const database = {
  customers: {
    1: {
      customerId: 1,
      purchaseHistory: {
        items: [
          {
            itemId: 1,
            itemName: 'item1',
            itemPrice: 100,
          },
          {
            itemId: 2,
            itemName: 'item2',
            itemPrice: 200,
          },
        ],
      },
    },
    2: {
      customerId: 2,
      purchaseHistory: {
        items: [
          {
            itemId: 3,
            itemName: 'item3',
            itemPrice: 300,
          },
          {
            itemId: 4,
            itemName: 'item4',
            itemPrice: 400,
          },
        ],
      },
    },
  },
};
