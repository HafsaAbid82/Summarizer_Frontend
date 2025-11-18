import './App.css';
import { useState } from 'react';
function App() {
    const [url, setUrl] = useState('');
    const [hfSummary, setHfSummary] = useState(null);
    const [openaiSummary, setOpenaiSummary] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState(null); 
    const [loading, setLoading] = useState(false);
    const onSubmit = async (event) => {
        event.preventDefault(); 
        setStatusMessage('');
        setStatusType(null);
        setHfSummary(null); 
        setOpenaiSummary(null); 
        setLoading(true);
        if (!url.trim()) {
            setStatusMessage("Please enter a valid URL before submitting.");
            setStatusType("error");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch("https://summarizer-backend-delta.vercel.app/summarization", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url }), 
            });
            const data = await response.json();
            if (response.ok) {
                if (data.hf_summary && data.openai_summary) {
                    setHfSummary(data.hf_summary);
                    setOpenaiSummary(data.openai_summary);
                    setStatusMessage("Summaries generated successfully!");
                    setStatusType("success");
                } else {
                    setStatusMessage(`Success but no summary data: ${data.status}`);
                    setStatusType("warning");
                }
            } else {
                setStatusMessage(`Error: ${data.detail ? (Array.isArray(data.detail) ? 'Invalid request data. Check URL format.' : data.detail) : "An unknown server error occurred."}`);
                setStatusType("error");
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <div className="App">
            <header className="App-header">
                <h1>Article Summarizer</h1>
                <form className="form-container" onSubmit={onSubmit}> 
                    <div className="input-box">
                        <input 
                            id="url-input"
                            type="url" 
                            name="url" 
                            required 
                            value={url} 
                            onChange={(e) => setUrl(e.target.value)} 
                            disabled={loading}
                        />
                        <label htmlFor="url-input">Enter Article URL</label>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
                {statusMessage && (
                    <p
                        className={`status-message ${statusType}`}
                    >
                        {statusMessage}
                    </p>
                )}
                {(hfSummary || openaiSummary) && (
                    <div className="summary-results">
                        <h2>Summarization Results</h2>
                        <div className="summary-box hf-summary">
                            <h3>Hugging Face (BART) Summary</h3>
                            <p>{hfSummary || 'No summary available.'}</p>
                        </div>
                        <div className="summary-box openai-summary">
                            <h3>OpenAI (GPT-4o-mini) Summary</h3>
                            <p>{openaiSummary || 'No summary available.'}</p>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}
export default App;
