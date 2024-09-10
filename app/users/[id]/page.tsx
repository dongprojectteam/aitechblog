export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>User Profile</h1>
      <p>This is the profile of user {params.id}.</p>
    </div>
  )
}