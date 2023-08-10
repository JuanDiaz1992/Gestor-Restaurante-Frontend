function formatCompact(value) {
    const result = new Intl.NumberFormat(
      'es-CO',
      {  currency: 'COP',
      style: 'currency',
      minimumFractionDigits: 0}
    ).format(value)
    return result;
  }

export default formatCompact;