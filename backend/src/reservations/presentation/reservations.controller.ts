import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { CancelReservationUseCase } from '../application/use-cases/cancel-reservation.use-case';
import { FindAuditReservationsUseCase } from '../application/use-cases/find-audit-reservations.use-case';
import { FindMyReservationsUseCase } from '../application/use-cases/find-my-reservations.use-case';
import {
    AuditReservationItemDto,
    ReservationResponseDto,
    toAuditDto,
    toReservationResponseDto,
} from './dto/reservation-response.dto';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { RolesGuard } from '../../roles/roles.guard';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

type ReqWithUser = { user: JwtPayloadType };

@ApiTags('Reservations')
@Controller({ version: '1', path: 'reservations' })
export class ReservationsController {
    constructor(
        private readonly findMy: FindMyReservationsUseCase,
        private readonly findAudit: FindAuditReservationsUseCase,
        private readonly cancel: CancelReservationUseCase,
    ) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleEnum.user, RoleEnum.admin)
    @Get('me')
    @ApiOkResponse({ type: [ReservationResponseDto] })
    myReservations(@Request() request: ReqWithUser): Promise<ReservationResponseDto[]> {
        return this.findMy
            .execute(String(request.user.id))
            .then((list) => list.map((r) => toReservationResponseDto(r)));
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleEnum.admin)
    @Get()
    @ApiOkResponse({ type: [AuditReservationItemDto] })
    audit(): Promise<AuditReservationItemDto[]> {
        return this.findAudit.execute().then((rows) => rows.map((r) => toAuditDto(r)));
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleEnum.user, RoleEnum.admin)
    @Delete(':id')
    @ApiParam({ name: 'id' })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ReservationResponseDto })
    cancelOne(
        @Request() request: ReqWithUser,
        @Param('id') id: string,
    ): Promise<ReservationResponseDto> {
        return this.cancel
            .execute(id, String(request.user.id))
            .then((r) => toReservationResponseDto(r));
    }
}
