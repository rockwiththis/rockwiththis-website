export default function(songPostData) {
  return songPostData.description.replace(/\n+/g, '<br />  ');
}
