/**
 * @file Helper functions for timing in the renderer process
 * @author Jonathan Weatherspoon
 * @module
 */

 exports.wait = (ms) => {
     return new Promise(resolve => {
         setTimeout(() => resolve(), ms);
     })
 }