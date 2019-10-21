"use strict";

function getFileType(path) {
  if (path) {
    const fileType = path.substr(path.lastIndexOf(".") + 1);
    if (
      fileType === "jpg" ||
      fileType === "JPG" ||
      fileType === "gif" ||
      fileType === "png" ||
      fileType === "jpeg"
    ) {
      return "image";
    } else if (fileType === "mp3") {
      return "audio";
    } else if (fileType === "mp4") {
      return "video";
    } else if (fileType === "pdf") {
      return "pdf";
    } else if (fileType === "zip") {
      return "package";
    } else {
      return "other";
    }
  }
}

function checkMediaSize(file, { size = null } = {}) {
  if (size) {
    if (/kb$/.test(size)) {
      let num = size.split("kb")[0];
      if (file.size > num * 1024) {
        this.$message.error(`上传文件大小超过${size}`);
        return new Promise((resolve, reject) => {
          reject();
        });
      }
    } else if (/mb$/.test(size)) {
      let num = size.split("mb")[0];
      if (file.size > num * 1024 * 1024) {
        this.$message.error(`上传文件大小超过${size}`);
        return new Promise((resolve, reject) => {
          reject();
        });
      }
    } else {
      this.$message.error(`文件大小设置错误`);
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }
  return new Promise((resolve, reject) => {
    resolve();
  });
}

function packageUpload() {}

export default { getFileType, checkMediaSize, packageUpload };
