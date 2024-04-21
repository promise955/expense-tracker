
export const currencyFormatter = (amount) => {

  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);

  return formattedAmount
};

export const dateFormatter = (datetime) => {

  const newDate = new Date(datetime);
  //let date = newDate.split('T')[0];
  const formattedDate = newDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return formattedDate

}
