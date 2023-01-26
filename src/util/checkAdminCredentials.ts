export interface adminCredentials {
  [key: string]: string|undefined;
  email: string;
  password: string;
}

const checkAdminCredentials = (credentialsToCheck:adminCredentials) => {
  const adminCredentials:adminCredentials = {
    email: "admin@admin.com",
    password: "1234567890",
  };

  for(let field in credentialsToCheck){
    if(credentialsToCheck[field] !== adminCredentials[field]){
      return false;
    }
  }

  return true;
};



export default checkAdminCredentials;