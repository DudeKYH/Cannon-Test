using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.IO;

public class MapExporterEditor : EditorWindow
{
    [System.Serializable]
    public class SerializableObstacle
    {
        public float x, y, z;
        public float width, height, depth;
        public float rotX, rotY, rotZ, rotW;

        public SerializableObstacle(Vector3 position, Vector3 size, Quaternion rotation)
        {
            x = position.x;
            y = position.y;
            z = position.z;

            width = size.x;
            height = size.y;
            depth = size.z;

            rotX = rotation.x;
            rotY = rotation.y;
            rotZ = rotation.z;
            rotW = rotation.w;
        }
    }

    [System.Serializable]
    public class MapData
    {
        public List<SerializableObstacle> obstacles = new List<SerializableObstacle>();
    }

    [MenuItem("Tools/Export Map Data")]
    static void ExportMapData()
    {
        // 오브젝트 검색
        GameObject[] mapObjects = GameObject.FindGameObjectsWithTag("Map");
        if (mapObjects.Length == 0)
        {
            Debug.LogWarning("No objects found with the tag 'Map'.");
            return;
        }

        // 데이터 초기화
        MapData mapData = new MapData();

        // 각 오브젝트의 위치를 기록
        foreach (var obj in mapObjects)
        {
            Vector3 position = obj.transform.position;

            // 크기 가져오기
            Vector3 size = Vector3.zero;
            var collider = obj.GetComponent<Collider>();
            if (collider != null)
            {
                size = collider.bounds.size;
            }
            else
            {
                var renderer = obj.GetComponent<Renderer>();
                if (renderer != null)
                {
                    size = renderer.bounds.size;
                }
            }

            Quaternion rotation = obj.transform.rotation;

            // 데이터 저장
            mapData.obstacles.Add(new SerializableObstacle(position, size, rotation));
        }

        // JSON 저장
        string json = JsonConvert.SerializeObject(mapData, Formatting.Indented, new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        });
        File.WriteAllText(Application.dataPath + "/map.json", json);
        Debug.Log("Map data saved to " + Application.dataPath + "/map.json");
    }
}