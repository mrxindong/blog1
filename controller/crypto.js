const crypto =require('crypto');

function encryption(password){
    const newpassword = Md5(Md5(password).substr(2, 7) + Md5(password));
    return newpassword
};

function Md5(password){
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
};

var aa=encryption("w121775");

console.log(aa);