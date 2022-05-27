function formatDateTime(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default formatDateTime;
