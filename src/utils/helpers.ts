export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const getGreeting = (name: string): string => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  return `${greeting}, ${name}`;
};

export const maskPhone = (phone: string): string => {
  if (phone.length < 6) {
    return phone;
  }
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
};
