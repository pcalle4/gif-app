import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { GifsService } from 'src/app/gifs/services/gifs.service';

interface MenuOptions {
  label: string;
  route: string;
  sublabel: string;
  icon: string
}


@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
})
export class SideMenuOptionsComponent {


  gifService = inject(GifsService)

  menuOptions: MenuOptions[] =[

    {
      label:'Trending',
      sublabel:'Gifs populares',
      route:'/dashboard/trending',
      icon:'fa-solid fa-chart-line'
    },
    {
      label:'Buscador',
      sublabel:'Buscar gifs',
      route:'/dashboard/search',
      icon:'fa-solid fa-magnifying-glass'
    },
  ]
}
