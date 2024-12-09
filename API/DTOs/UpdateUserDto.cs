namespace API.DTOs;

public class UpdateUserDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }  // Optional, only if changing password
    public string? Role { get; set; }
}