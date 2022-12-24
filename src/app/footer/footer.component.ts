import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  /**
   * componet name
   * @var componentName
   */
  componentName:string = 'Copyright'; // footer

  /**
   * current Year
   */
  todayYear: number = Date.now();

  constructor() { }

  ngOnInit(): void {
  }

}
