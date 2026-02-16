# Desktop Troubleshooting

## macOS permissions

If screen sharing or microphone capture fails on macOS:

1. Open `System Settings > Privacy & Security > Screen Recording`.
2. Ensure `Sharkord Desktop` is allowed.
3. Open `System Settings > Privacy & Security > Microphone`.
4. Ensure `Sharkord Desktop` is allowed.
5. Restart the app after changing permissions.

In the current developer preview, macOS screen-share audio is not available. Screen video sharing continues without audio.

## Linux PipeWire and portal behavior

Linux screen/audio capture depends on your desktop session and portal stack.

1. Verify PipeWire and xdg-desktop-portal services are running.
2. Confirm your portal backend matches your compositor (GNOME/KDE/wlroots).
3. Retry screen sharing after restarting the desktop portal services.

Linux audio capture in this preview is best-effort. If audio is unavailable, Sharkord should continue sharing screen video and show a warning.

## Fallback behavior

When shared audio cannot be captured on the current platform or environment:

1. Sharkord continues with screen video if possible.
2. A non-blocking warning is shown.
3. You can switch audio mode to `No shared audio` to suppress audio capture attempts.
