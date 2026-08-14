export const formatPrice = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

export const formatPrice2 = (value) => formatPrice(value)
