// Depricated gg's

// Sample stamp
export async function getStampsForUser(userId: number) {
  return [
    {
      id: 1,
      name: "Sample Stamp",
      imageUrl: "/image.png",
      eventName: "Sample Event",
      date: new Date().toISOString(),
    },
  ];
}
