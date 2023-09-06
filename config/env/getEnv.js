import productionEnv from "./productionEnv";
import testEnv from "./testEnv";

const getEnv = (name) => {
    const NODE_ENV = process.env.NODE_ENV;
    if(NODE_ENV === "production"){
        return productionEnv[name]
    } else {
        return testEnv [name]
    }
}

export {getEnv};