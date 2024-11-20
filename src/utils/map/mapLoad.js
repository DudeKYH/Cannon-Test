import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetPath = path.join(__dirname, "../../asset");

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(assetPath, filename), "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

const mapData = [];

export const loadMapData = async () => {
  try {
    const mapJson = await readFileAsync("map.json");

    mapJson.obstacles.forEach((obstracle) => {
      mapData.push(obstracle);
    });
  } catch (err) {
    console.error(`loadMapData Error: ${err.message}`);
  }
};

export const getMapData = () => {
  return mapData;
};
