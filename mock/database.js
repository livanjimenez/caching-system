export const database = {
  customers: {
    1: {
      customerId: 1, // key
      purchaseHistory: {
        items: [
          // value
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

export const cacheMissDatabase = {
  customers: {
    3: {
      customerId: 3,
      purchaseHistory: {
        items: [
          {
            itemId: 5,
            itemName: 'item5',
            itemPrice: 100,
          },
          {
            itemId: 6,
            itemName: 'item6',
            itemPrice: 200,
          },
        ],
      },
    },
    4: {
      customerId: 4,
      purchaseHistory: {
        items: [
          {
            itemId: 7,
            itemName: 'item7',
            itemPrice: 300,
          },
          {
            itemId: 8,
            itemName: 'item8',
            itemPrice: 400,
          },
        ],
      },
    },
  },
};
