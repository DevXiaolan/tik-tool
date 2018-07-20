if(![__enums__].includes(__name__)) {
  throw {
    code: 400000,
    message: ` __name__ MUST IN [ __enums__ ]`
  }
}