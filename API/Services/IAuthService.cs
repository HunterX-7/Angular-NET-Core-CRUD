namespace API.Services;

public interface IAuthService
{
    string GenerateJwtToken(Models.User user);
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}