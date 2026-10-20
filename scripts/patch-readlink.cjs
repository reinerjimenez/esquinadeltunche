/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Parche de compatibilidad Node.js v26 / Windows — EISDIR en readlink
 *
 * En Node.js v26 en Windows, fs.readlink / fs.promises.readlink lanza EISDIR
 * para archivos normales en lugar de EINVAL.
 * Webpack y Next.js (nft trace, collect-build-traces, hashFile) llaman readlink
 * para detectar symlinks y esperan EINVAL si no es un symlink.
 * Al recibir EISDIR, Next.js crashea en build.
 *
 * Este script parchea fs y fs/promises para convertir EISDIR / errno -4068 a EINVAL.
 */
const fs = require("fs");
const fsp = require("fs/promises");

function fixError(err, p) {
  if (err && (err.code === "EISDIR" || err.errno === -4068)) {
    const pathStr = typeof p === "string" ? p : String(p || "");
    const newErr = Object.assign(
      new Error("EINVAL: invalid argument, readlink '" + pathStr + "'"),
      {
        code: "EINVAL",
        errno: -4071,
        syscall: "readlink",
        path: pathStr,
      }
    );
    return newErr;
  }
  return err;
}

// 1. fs.readlink (callback)
const _origReadlink = fs.readlink.bind(fs);
fs.readlink = function patchedReadlink(path, optionsOrCb, maybeCb) {
  const cb = typeof maybeCb === "function" ? maybeCb : optionsOrCb;
  const opts = typeof maybeCb === "function" ? optionsOrCb : undefined;

  const wrappedCb = function (err, link) {
    if (err) {
      cb(fixError(err, path));
    } else {
      cb(null, link);
    }
  };

  if (opts !== undefined) {
    _origReadlink(path, opts, wrappedCb);
  } else {
    _origReadlink(path, wrappedCb);
  }
};

// 2. fs.readlinkSync
const _origReadlinkSync = fs.readlinkSync.bind(fs);
fs.readlinkSync = function patchedReadlinkSync(path, options) {
  try {
    return _origReadlinkSync(path, options);
  } catch (err) {
    throw fixError(err, path);
  }
};

// 3. fs.promises.readlink
if (fsp && fsp.readlink) {
  const _origPromisesReadlink = fsp.readlink.bind(fsp);
  fsp.readlink = async function patchedPromisesReadlink(path, options) {
    try {
      return await _origPromisesReadlink(path, options);
    } catch (err) {
      throw fixError(err, path);
    }
  };
  if (fs.promises) {
    fs.promises.readlink = fsp.readlink;
  }
}
