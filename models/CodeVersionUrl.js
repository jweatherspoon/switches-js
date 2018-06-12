class CodeVersionUrl {
    constructor(base, datapath) {
        this._base = base;
        this._datapath = datapath;
    }

    get base() {
        return this._base;
    }

    set base(newBase) {
        this._base = newBase;
    }

    get datapath() {
        return this._datapath;
    }

    set dataPath(newPath) {
        this._datapath = newPath;
    }

    get url() {
        return `${this._base}/${this._datapath}`;
    }
}

exports.CodeVersionUrl = CodeVersionUrl;