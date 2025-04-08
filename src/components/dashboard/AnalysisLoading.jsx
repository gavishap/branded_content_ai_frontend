// If analysis is complete, notify parent component - only once
if (data.status === 'completed' && onAnalysisComplete && !isComplete) {
  console.log('Analysis complete, calling onAnalysisComplete');
  stopPolling();
  setIsComplete(true);

  // First check if there's a result object with data we need
  if (data.result) {
    console.log(
      'Analysis result data found in progress response:',
      data.result.id || analysisId
    );
    onAnalysisComplete(
      data.result.id || analysisId,
      data.metadata || data.result.metadata
    );
  } else {
    // Otherwise use the result_id or analysisId for retrieving data
    console.log(
      'No result data found, using result_id or analysisId:',
      data.result_id || analysisId
    );
    onAnalysisComplete(data.result_id || analysisId, data.metadata);
  }
}
