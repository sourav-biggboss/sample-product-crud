import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  /**
   * nav right side text
   * @var string
   */
  @Input() appName!:string;
  
  /**
   * componet name
   * @var componentName
   */
  componentName:string = 'Navigation'
  
  /**
   * logo hieght
   * @var logoHeight
   */
  logoHeight:number = 30;

  /**
   * logo hieght
   * @var logoWidth
   */
   logoWidth:number = 30;

  /**
   * nav bar side logo src
   * @var string 
   */
  public logoSrc:string = 'assets/angular-top-nav-logo'+'.svg';

  /**
   * side nav toggle status
   * @var navToggle 
   */
   @Input() public navToggle:boolean = false;

  constructor(private AuthService:AuthService) { }

  ngOnInit(): void {
  }

  /**
   * Toggle nav side
   */
  toggleNavigation():void{
    this.navToggle = !this.navToggle; 
  }

  logout(){
    this.AuthService.logout();
    window.location.reload();
  }

  isLogin(){
    return this.AuthService.isLoggedIn();
  }

  /**
   * Close nav side
   */
   closeNavigation():void{
    this.navToggle = false; 
  }

}
