class indexarticle {
    constructor() {

    }

    static getIns() {
        if (!indexarticle.ins) {
            indexarticle.ins = new indexarticle();
        }
        return indexarticle.ins;
    }
    getresult() {
        if (this.result!=undefined) {
            return this.result;
        }
    }
    setresult(res) {
        this.result = res;
    }

};

module.exports = indexarticle.getIns();