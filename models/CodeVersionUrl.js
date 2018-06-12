/**
 * Model for storing information about code version URLs
 */
class CodeVersionUrl {
    /**
     * Store some data about a code version url
     * @constructor
     * @param {string} base base url for the website
     * @param {string} datapath path to the data for html parsing
     */
    constructor(base, datapath) {
        this._base = base;
        this._datapath = datapath;
    }

    /**
     * Get the base url
     * @returns {string} The base url 
     */
    get base() {
        return this._base;
    }

    /**
     * Set the base url
     * @param {string} newBase - The new base url to store
     */
    set base(newBase) {
        this._base = newBase;
    }

    /**
     * Get the data path 
     * @returns {string} The data path part of the url
     */
    get datapath() {
        return this._datapath;
    }

    /**
     * Set the datapath 
     * @param {string} newPath - The new data path 
     */
    set dataPath(newPath) {
        this._datapath = newPath;
    }

    /**
     * Get the full url
     * @returns {string} The full url in the format base/datapath
     */
    get url() {
        return `${this._base}/${this._datapath}`;
    }
}

exports.CodeVersionUrl = CodeVersionUrl;