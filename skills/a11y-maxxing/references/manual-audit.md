# Manual audit matrix

For each matrix row, mark every category below **Applicable** or **N/A** — mark categories N/A rather than forcing irrelevant work. Complete every check in each applicable category, or record why it cannot be tested. Record the exact browser, operating system, assistive technology, and version for all screen-reader evidence.

## 1. Keyboard and focus

Applies to any interactive content.

- Complete every essential action without a pointer, navigating forward and in reverse.
- Arrow-key behavior matches the component's pattern; Escape dismisses what it should; no keyboard traps.
- Focus order preserves meaning and operation; focus is always visible; the focused element is never fully obscured by author-created sticky or overlay content.
- Focus moves into and returns from dialogs and other context changes predictably.
- Only operable elements sit in the tab order, unless a specific focus-management reason exists.

## 2. Semantics and structure

Applies to every row.

- Landmarks, headings, and reading order express the visual structure programmatically.
- Every control exposes the correct role, accessible name, description, value, and state changes.
- Names favor visible text; ARIA appears only where native HTML cannot express the behavior, and each role is honored as a keyboard and focus contract.

## 3. Screen-reader journeys

Applies when a screen reader is in the support baseline.

- Exercise the selected complete journeys with each declared browser/AT combination, including dialogs, form errors, asynchronous loading and progress, result counts, and toasts.
- Status changes are announced without moving focus; live regions are meaningful rather than chatty.
- Evidence names the browser, OS, assistive technology, and versions actually used.

## 4. Zoom, resize, reflow, orientation, and contrast

Applies to every visual row.

- Text resizes to 200% without loss of content or function.
- Content reflows at a 320 CSS-pixel-wide viewport (256 CSS-pixel height for vertical writing) without two-dimensional scrolling, except permitted content such as data tables.
- Intermediate zoom and layout points are checked where sticky headers, banners, dialogs, and controls can overlap, clip, or hide focused content.
- Responsive variants, both supported orientations when layout or function changes, and text-spacing overrides are checked where applicable.
- Text contrast, non-text contrast for controls and focus/state indicators, and color-independent meaning all hold; forced-colors mode is checked when the support baseline includes it.

## 5. Motion, timing, and input modality

Applies when motion, autoplay, gestures, drag, or timed content exist.

- With reduced motion enabled, non-essential motion is removed or replaced while essential state feedback remains.
- Automatically moving, blinking, scrolling, or updating content can be paused, stopped, or hidden where required; flashing stays within limits.
- Path or multipoint gestures have single-pointer alternatives; dragging has a non-drag alternative; motion actuation has a non-motion alternative.
- Every target measures at least 24×24 CSS pixels or meets a defined exception, measured on the actual target, including inside newly displayed content such as menus and dialogs.

## 6. Forms, errors, authentication, and recovery

Applies when forms or transactions exist.

- Labels and instructions are visible, programmatically associated, and paired with usable autocomplete and input purposes where appropriate.
- Every material validation and submission failure is triggered: the field and error are identified in text, associated programmatically, and announced appropriately; entered data is preserved; a correction is suggested when one is known.
- Focus and summary behavior at submission and recovery is verified with keyboard, zoom, and screen reader.
- Authentication is accessible, redundant entry is avoided, and important transactions support review or reversal.

## 7. Images, structure, tables, and media

Applies when such content exists.

- Each non-text alternative communicates the image's purpose in context; decorative images are ignored by assistive technology; complex images and charts have equivalent explanations.
- Headings, lists, regions, and tables express their visual relationships programmatically.
- Media has keyboard-accessible labeled controls, accurate synchronized captions, transcripts or alternatives for audio-only material, and audio description or a media alternative for important visual information.
