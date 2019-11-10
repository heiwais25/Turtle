/**
 * To make convinient, split the part that handling access to remote object of electron
 */

const { remote } = window.require("electron");

export default remote.getGlobal("db");
