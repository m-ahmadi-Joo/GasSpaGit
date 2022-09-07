import { Component, OnInit, Input } from '@angular/core';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ArchitecturalAlbumApproveDetailForm',
  templateUrl: './ArchitecturalAlbumApproveDetailForm.component.html',
  styleUrls: ['./ArchitecturalAlbumApproveDetailForm.component.scss']
})

export class ArchitecturalAlbumApproveDetailFormComponent implements OnInit {
  info: any = {};

  @Input() id: number;

  constructor(private api: ApiCommandCenter, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let gasReqId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.api.getFrom("GasRequest/"+ gasReqId + "/ArchitecturalAlbums/" + this.id, null)
      .subscribe((res: any) => {
        console.log(res);
        this.info = res;
      },
      err => {
        console.log(err.error);
      });
  }
}
