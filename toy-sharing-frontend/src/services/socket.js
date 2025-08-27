import api from "./api";

// Lấy trạng thái Socket.IO
export const getSocketStatus = async () => {
  try {
    const response = await api.get("/socket/status");
    return {
      connected: response.data.data?.connected || false,
      activeUsers: response.data.data?.activeUsers || 0,
      timestamp: response.data.data?.timestamp || new Date().toISOString(),
      success: response.data.success || true,
    };
  } catch (error) {
    console.error("Error fetching socket status:", error);
    return {
      connected: false,
      activeUsers: 0,
      timestamp: new Date().toISOString(),
      success: false,
    };
  }
};

// Health check API
export const healthCheck = async () => {
  try {
    const response = await api.get("/health");
    return {
      status: "healthy",
      message: response.data.message || "API is running",
      timestamp: response.data.timestamp || new Date().toISOString(),
      environment: response.data.environment || "development",
      success: response.data.success || true,
    };
  } catch (error) {
    console.error("Error checking API health:", error);
    return {
      status: "unhealthy",
      message: "API is not responding",
      timestamp: new Date().toISOString(),
      environment: "unknown",
      success: false,
    };
  }
};

// Lấy thông tin về API endpoints
export const getApiInfo = async () => {
  try {
    const response = await api.get("/");
    return {
      version: response.data.version || "1.0.0",
      endpoints: response.data.endpoints || {},
      realtime: response.data.realtime || {},
      success: response.data.success || true,
    };
  } catch (error) {
    console.error("Error fetching API info:", error);
    return {
      version: "unknown",
      endpoints: {},
      realtime: {},
      success: false,
    };
  }
};
