module.exports = {
  formatName: (name) => {
    return name.toString().toLowerCase().replace(/_/g,'-')
  },
}