import { MbaLogo } from '../brand/MbaLogo'

export function AdminLogo() {
  return (
    <>
      <MbaLogo className="mba-admin-logo mba-admin-logo--light" />
      <MbaLogo variant="white" className="mba-admin-logo mba-admin-logo--dark" />
    </>
  )
}
