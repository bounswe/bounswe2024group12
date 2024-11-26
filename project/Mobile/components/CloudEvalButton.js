import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Cloud } from 'lucide-react';

const CloudEvalButton = ({ fen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [evalData, setEvalData] = useState(null);
  const [error, setError] = useState(null);

  const fetchEvaluation = async () => {
    if (!fen) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}`);
      
      if (!response.ok) {
        throw new Error('Evaluation not available');
      }
      
      const data = await response.json();
      setEvalData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatEvaluation = (eval_data) => {
    if (!eval_data) return '';
    const depth = eval_data.depth;
    const knodes = Math.round(eval_data.knodes / 1000);
    return `Depth: ${depth} | Nodes: ${knodes}M`;
  };

  return (
    <View className="flex flex-col">
      <View className="flex flex-row items-center">
        <TouchableOpacity
          onPress={fetchEvaluation}
          disabled={isLoading}
          className={`flex flex-row items-center justify-center px-3 py-2 rounded-lg ${
            isLoading ? 'bg-gray-300' : 'bg-blue-500'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Cloud className="w-4 h-4 mr-2 text-white" />
              <Text className="text-white font-medium">Cloud Eval</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {evalData && (
        <View className="mt-2 p-2 bg-gray-100 rounded">
          <Text className="text-sm text-gray-700">{formatEvaluation(evalData)}</Text>
        </View>
      )}
      
      {error && (
        <View className="mt-2">
          <Text className="text-sm text-red-500">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default CloudEvalButton;