using API.DTOs;

namespace API.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync(string searchTerm = null);
    Task<UserDto> GetUserByIdAsync(int id);
    Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
    Task<UserDto> UpdateUserAsync(int id, UpdateUserDto updateUserDto);
    Task DeleteUserAsync(int id);
}