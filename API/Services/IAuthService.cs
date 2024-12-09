namespace API.Services;
using API.DTOs;

public interface IAuthService
{
    Task<LoginResponse> Login(LoginRequest request);
    string GenerateJwtToken(Models.User user);
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}