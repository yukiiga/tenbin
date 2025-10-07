// src/components/RuleScreen.jsx

import React from 'react';
import { AlertCircle, Target, Home } from 'lucide-react';

export default function RuleScreen({ onNext, eliminatedCount, onBackToTitle }) {
  const baseRules = [
    '制限時間3分の間に0～100の中から数字を1つ選ぶ',
    '全員が選んだ数字の平均値×0.8に最も近い値を選んだ人が勝者',
    '勝者以外の4人が1ポイント減点',
    '減点が-10ポイントに達するとゲームオーバー',
    '最後に生き残った1人がゲームクリア'
  ];

  const newRules = [
    { condition: 1, text: '2人以上、同数が出た場合、無効票となり1ポイント減点' },
    { condition: 2, text: '正解の数字をピタリとあてられたら、敗者は2ポイント減点' },
    { condition: 3, text: '0を選択した人がいる場合に限り、100を選択した人が勝者' }
  ];

  const activeNewRules = newRules.filter(r => r.condition <= eliminatedCount);

  return (
    <div className="fixed inset-0 bg-[#0a1628] bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] overflow-auto">
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-5xl font-bold text-white flex items-center gap-4">
              <AlertCircle className="w-12 h-12 text-cyan-400" />
              ゲームルール
            </h2>
            {eliminatedCount > 0 && (
              <button
                onClick={onBackToTitle}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                タイトルに戻る
              </button>
            )}
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-8 border border-cyan-900/30 mb-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">基本ルール</h3>
            <ul className="space-y-4">
              {baseRules.map((rule, i) => (
                <li key={i} className="text-white text-lg flex items-start gap-3">
                  <span className="text-cyan-400 text-xl mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeNewRules.length > 0 && (
            <div className="bg-red-900/20 backdrop-blur-sm rounded-lg p-8 border-2 border-red-500/50 mb-6">
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <Target className="w-7 h-7" />
                追加ルール
              </h3>
              <ul className="space-y-4">
                {activeNewRules.map((rule, i) => (
                  <li key={i} className="text-white text-lg flex items-start gap-3">
                    <span className="text-red-400 text-xl mt-1">★</span>
                    <span>{rule.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onNext}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-5 rounded-lg text-2xl font-bold transition-all"
          >
            {eliminatedCount === 0 ? 'ゲームを始める' : '次のラウンドへ'}
          </button>
        </div>
      </div>
    </div>
  );
}