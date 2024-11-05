const fs = require('fs');
const path = require('path');

const moveFile = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject('文件移动失败: ' + err);
      } else {
        resolve('文件移动成功');
      }
    })
  })
}

// 删除其余文件的函数
const userIdRegex = /\[userId-(\d+)\]/;
const deleteOtherFiles = (id) => {
  const directory = 'uploads\\image';

  // 读取目录中的所有文件
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject('读取文件夹失败: ' + err);
      } else {
        // 遍历文件并删除
        if (files.length > 0) {
          files.forEach(file => {
            const filePath = path.join(directory, file);
            if (filePath.match(userIdRegex)[1] === id) {  // 确保不是刚移动的文件
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error(`删除文件失败 ${filePath}: ${err}`);
                } else {
                  console.log(`成功删除文件 ${filePath}`);
                }
              });
            }
          });
        }
        resolve('其余文件已删除');
      }
    });
  });
}

// 执行移动和删除操作
const manageFiles = async (oldPath, newPath) => {
  try {
    await moveFile(oldPath, newPath);
    await deleteOtherFiles(oldPath);
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  moveFile,
  deleteOtherFiles,
  manageFiles
}