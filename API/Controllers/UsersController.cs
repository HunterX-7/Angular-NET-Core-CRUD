using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Services;
using API.DTOs;

namespace API.Controllers;

/// <summary>
/// Controller for managing users
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Gets all users (Admin only)
    /// </summary>
    /// <param name="search">Search term filter users by name or email</param>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers([FromQuery] string search = null)
    {
        var users = await _userService.GetAllUsersAsync(search);
        return Ok(users);
    }

    /// <summary>
    /// Gets a specific user by ID (Admin or self)
    /// </summary>
    /// <param name="id">User ID</param>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && currentUserId != id)
            {
                return Forbid();
            }

            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            
            return Ok(user);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "User not found" });
        }
    }

    /// <summary>
    /// Creates a new user (Admin only)
    /// </summary>
    /// <param name="createUserDto">User data</param>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        try
        {
            var user = await _userService.CreateUserAsync(createUserDto);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates a user (Admin or self)
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="updateUserDto">Updated user data</param>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && currentUserId != id)
            {
                return Forbid();
            }

            if (!isAdmin && !string.IsNullOrEmpty(updateUserDto.Role))
            {
                return BadRequest(new { message = "Regular users cannot change roles" });
            }

            var user = await _userService.UpdateUserAsync(id, updateUserDto);
            return Ok(user);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "User not found" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes a user (Admin only)
    /// </summary>
    /// <param name="id">User ID</param>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "User not found" });
        }
    }
}