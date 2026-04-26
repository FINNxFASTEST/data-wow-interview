/**
 * Entry `/` is handled in middleware: signed-in users go to their role home,
 * others to `/login`. This route should not render for normal traffic.
 */
export default function HomePage() {
  return null;
}
