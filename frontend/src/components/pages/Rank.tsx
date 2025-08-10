// RankPage.js

import React, { useState } from "react";

// ✅ 히트맵(정답 분포) 예시 데이터
const heatmapData = [
  [0, 1, 1, 2, 3, 2, 0, 0, 0, 1],
  [0, 2, 4, 2, 1, 1, 0, 0, 1, 2],
  [1, 2, 3, 3, 4, 3, 2, 1, 0, 0],
  [0, 1, 2, 2, 1, 2, 3, 2, 1, 0],
  [1, 1, 2, 3, 10, 4, 2, 3, 2, 1],
  [1, 1, 1, 2, 2, 3, 0, 1, 1, 0],
  [0, 0, 1, 2, 2, 2, 1, 2, 3, 2],
  [1, 2, 2, 3, 3, 2, 1, 1, 1, 0]
];
const heatColors = [
  "#e0ffe5", // 0회
  "#b3e6c3", // 1~3회
  "#66c985", // 4~6회
  "#3a8049", // 7~9회
  "#124021", // 10회 이상
];

// ✅ 명예의 전당(랭커) 예시 데이터
const rankingData = [
  { rank: 1, nickname: "랭킹최강자", score: 9999 },
  { rank: 2, nickname: "수완탑", score: 9000 },
  { rank: 3, nickname: "나의이름은", score: 8500 },
  { rank: 4, nickname: "열정로봇", score: 8000 },
  { rank: 5, nickname: "관찰철인", score: 7800 },
];

function Rank() {
  const [tab, setTab] = useState("수완탑");

  const getColor = (n) => {
    if (n >= 10) return heatColors[4];
    if (n >= 7) return heatColors[3];
    if (n >= 4) return heatColors[2];
    if (n >= 1) return heatColors[1];
    return heatColors[0];
  };

  return (
    <div style={{
      maxWidth: 408, margin: "0 auto", fontFamily: "Pretendard, sans-serif",
      background: "linear-gradient(180deg,#ecefff 0%, #e8f7e8 100%)", minHeight: "100vh", padding: 16, borderRadius: 16
    }}>
      {/* 랭킹 헤더 */}
      <div style={{ fontWeight: 900, fontSize: 24, color: "#3a8049", display: "flex", alignItems: "center", gap: 6 }}>
        <span>🥚Rank</span>
        <span style={{ fontSize: 18, color: "#ffbe2d" }}>🥚</span>
      </div>

      {/* 내 프로필/순위 박스 */}
      <div style={{
        padding: "18px 0 8px 0",
        background: "rgba(255,255,255,0.80)",
        borderRadius: 14, marginBottom: 12, marginTop: 8, boxShadow: "0 2px 16px #dde6dc8e"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", background: "#e0ffe5",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28
          }}>👤</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>나의이름은 <span style={{ color: "#3a8049" }}>♥</span></div>
        </div>
        <div style={{ textAlign: "center", marginTop: 10, fontWeight: 600, color: "#555", fontSize: 17 }}>
          14위
        </div>
      </div>

      {/* 탭 버튼 */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 8, marginBottom: 20
      }}>
        {["참여탑", "수완탑", "관찰력탑"].map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: "7px 18px", borderRadius: 18, border: 0,
              fontWeight: tab === k ? 800 : 500,
              background: tab === k ? "#3a8049" : "#e0ffe5",
              color: tab === k ? "#fff" : "#3a8049", fontSize: 16,
              cursor: "pointer", boxShadow: tab === k ? "0 2px 12px #3a804966" : "none"
            }}
          >{k}</button>
        ))}
      </div>

      {/* 히트맵 + 범례 */}
      <div style={{
        background: "#f9fff9", borderRadius: 18, padding: "20px 10px 12px 10px", boxShadow: "0 2px 10px #dde6dc8e", marginBottom: 24
      }}>
        <div style={{ textAlign: "center", fontWeight: 700, color: "#3a8049" }}>정답 공간 분포</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 22px)", gap: "3px", justifyContent: "center", margin: "16px 0" }}>
          {heatmapData.map((row, i) => (
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                style={{
                  width: 22, height: 22,
                  background: getColor(cell),
                  borderRadius: 6,
                  border: cell === 0 ? "1px solid #dfdfdf" : 0,
                  color: cell === 0 ? "#bbb" : "#124021",
                  fontSize: 11, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >{cell > 0 ? cell : ""}</div>
            ))
          ))}
        </div>
        {/* 범례 */}
        <div style={{ display: "flex", gap: 11, fontSize: 12, justifyContent: "center", alignItems: "center", marginTop: 4 }}>
          <div><span style={{ background: heatColors[0], borderRadius: 6, display: "inline-block", width: 24, height: 15, verticalAlign: "middle", border: "1px solid #dfdfdf" }}></span> 0회</div>
          <div><span style={{ background: heatColors[1], borderRadius: 6, display: "inline-block", width: 24, height: 15 }}></span> 1~3회</div>
          <div><span style={{ background: heatColors[2], borderRadius: 6, display: "inline-block", width: 24, height: 15 }}></span> 4~6회</div>
          <div><span style={{ background: heatColors[3], borderRadius: 6, display: "inline-block", width: 24, height: 15 }}></span> 7~9회</div>
          <div><span style={{ background: heatColors[4], borderRadius: 6, display: "inline-block", width: 24, height: 15 }}></span> 10회 이상</div>
        </div>
      </div>

      {/* 명예의 전당 */}
      <div style={{ background: "#ffe3d0", borderRadius: 16, padding: 14, boxShadow: "0 2px 10px #d7c6b6aa", marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: "#ea9245", marginBottom: 6 }}>
          🏆 명예의 전당
        </div>
        <table style={{ width: "100%", fontSize: 15, color: "#523303", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #FFDFB5", fontWeight: 700 }}>
              <th style={{ width: 50 }}>순위</th>
              <th style={{ textAlign: "left" }}>닉네임</th>
              <th style={{ width: 80 }}>점수</th>
            </tr>
          </thead>
          <tbody>
            {rankingData.map(({ rank, nickname, score }, i) => (
              <tr key={rank} style={{ background: i % 2 ? "#fff5ee" : "transparent" }}>
                <td style={{ textAlign: "center", fontWeight: 800 }}>{rank}</td>
                <td style={{
                  textAlign: "left",
                  fontWeight: nickname === "나의이름은" ? 900 : 500,
                  color: nickname === "나의이름은" ? "#3a8049" : "#523303"
                }}>{nickname} {nickname === "나의이름은" && <span style={{ color: "#ff4f1b" }}>♥</span>}</td>
                <td style={{ textAlign: "center", fontWeight: 700 }}>{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Rank;
