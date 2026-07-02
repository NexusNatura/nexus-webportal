export const useAuth = () => {
  return {
    user: { id: "u1", name: "Peter Johansson", email: "peter@nexus.os" },
    isAuthenticated: true,
    isLoading: false,
    logout: () => {}
  }
}

