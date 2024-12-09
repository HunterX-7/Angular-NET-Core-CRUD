namespace API.DTOs;

public class LoginResponse
{
    public string Token { get; set; }
    public int UserId { get; set; }
    public string Role { get; set; }
    public string Email { get; set; }
}