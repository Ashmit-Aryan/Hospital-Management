function Header(){
    return(
        <header>
        <div className="container">
          <h1>Hospital Management System</h1>
          <nav>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#patients">Patients</a>
              </li>
              <li>
                <a href="#appointments">Appointments</a>
              </li>
              <li>
                <a href="#doctors">Doctors</a>
              </li>
              <li>
                <a href="#billing">Billing</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    )
}

export default Header;