
export default function getNextDirection(direction) {
  switch (direction) {
    case 'asc':
      return 'desc';

    case 'desc':
      return 'none';

    case 'none':
      return 'asc';  

    default:
      return 'asc';
  }
}